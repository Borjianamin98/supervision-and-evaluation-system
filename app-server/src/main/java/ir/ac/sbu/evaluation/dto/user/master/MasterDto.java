package ir.ac.sbu.evaluation.dto.user.master;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.dto.university.faculty.FacultyDto;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Master;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class MasterDto extends UserDto {

    private String degree;

    private UniversityDto university;
    private FacultyDto faculty;

    public MasterDto() {
    }

    @Builder
    public MasterDto(long id, String firstName, String lastName, String fullName, String username, String role,
            PersonalInfoDto personalInfo, String degree, UniversityDto university,
            FacultyDto faculty) {
        super(id, firstName, lastName, fullName, username, role, personalInfo);
        this.degree = degree;
        this.university = university;
        this.faculty = faculty;
    }

    public static MasterDto from(Master master) {
        return builder()
                .id(master.getId())
                .username(master.getUsername())
                .firstName(master.getFirstName()).lastName(master.getLastName())
                .fullName(master.getFullName())
                .role(master.getRole())
                .personalInfo(PersonalInfoDto.from(master.getPersonalInfo()))
                .degree(master.getDegree())
                .university(UniversityDto.from(master.getFaculty().getUniversity()))
                .faculty(FacultyDto.from(master.getFaculty()))
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        MasterDto masterDto = (MasterDto) o;
        return Objects.equals(degree, masterDto.degree);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), degree);
    }
}
