package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.admin.AdminDto;
import ir.ac.sbu.evaluation.dto.user.admin.AdminSaveDto;
import ir.ac.sbu.evaluation.model.user.Admin;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.repository.user.AdminRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final PasswordEncoder passwordEncoder;

    private final PersonalInfoRepository personalInfoRepository;
    private final AdminRepository adminRepository;

    public AdminService(PasswordEncoder passwordEncoder,
            PersonalInfoRepository personalInfoRepository,
            AdminRepository adminRepository) {
        this.passwordEncoder = passwordEncoder;
        this.personalInfoRepository = personalInfoRepository;
        this.adminRepository = adminRepository;
    }

    public AdminDto retrieve(long userId) {
        return AdminDto.from(adminRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: ID = " + userId)));
    }

    @Transactional
    public AdminDto save(AdminSaveDto adminSaveDto) {
        Admin admin = adminSaveDto.toAdmin();
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        PersonalInfo savedInfo = personalInfoRepository.save(admin.getPersonalInfo());
        admin.setPersonalInfo(savedInfo);

        return AdminDto.from(adminRepository.save(admin));
    }
}
