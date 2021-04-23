package ir.ac.sbu.evaluation.repository.user;

import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {

}
